// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::path::{Path, PathBuf};
use std::fs::{self, metadata, File};
use std::vec;
use base64::{engine::general_purpose::STANDARD_NO_PAD, Engine as _};
use std::io::{Cursor, Read, Write};

use image::DynamicImage;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct ImageInfoWithCaptions {
  // 缩略图/原图的base64编码
  src: String,
  // 原图尺寸
  width: u32,
  // 原图高度
  height: u32,
  
  // 文件名(不含后缀)
  filename: String,

  // 路径
  path: PathBuf,
  // 标签列表, path, filestem,filename
  captions: Vec<String>,
}


#[derive(Serialize)]
struct ImageInfo {
  // 缩略图/原图的base64编码
  src: String,
  // 原图尺寸
  width: u32,
  // 原图高度
  height: u32,
  
  // 文件名(不含后缀)
  filename: String,

  // 路径
  path: PathBuf,
}

#[derive(Serialize)]
struct ImagePathInfo {
  filename: String, 
  extension: String,
  stem: String,
  filepath: PathBuf,
}


#[derive(Deserialize)]
struct ImageSaveInfo {
  pub filename: String, // 文件名(不含后缀)
  pub captions: Vec<String>,
}





fn image_to_base64(image: &DynamicImage, image_fmt: image::ImageFormat) -> String {
  // 首先将 image 抓换为 Vec<u8> 的数组
  let mut buffer: Cursor<Vec<u8>> = Cursor::new(Vec::new());
  image.write_to(&mut buffer, image_fmt).expect("Failed to write image");
  let buffer = buffer.into_inner();
  let result = STANDARD_NO_PAD.encode(buffer);
  format!("data:image/{};base64,{}", image_fmt.extensions_str()[0], result.replace("\r\n", ""))
}


#[tauri::command]
fn check_path(path: &str) -> Result<(), String> {
  let dir_path = Path::new(&path);

  // 检查目录是否存在, 不存在直接报错
  if !dir_path.exists() {
    return Err(format!("Directory '{}' does not exist.", path));
  }

  if let Ok(md) = metadata(&dir_path) {
    if !md.is_dir() || md.permissions().readonly() {
      return Err(format!("Directory '{}' is not writable.", path));
    }
  } else {
    return Err(format!("Directory '{}' is not readable.", path));
  } 

  Ok(())
}



// 缩略图不应该使用高度来限制, 而是应该使用宽度来限制
#[tauri::command]
fn load_thumbnail_with_captions(image_path: &str, image_width: u32, caption_ext: &str) -> Result<ImageInfoWithCaptions, String> {
  let image_path = Path::new(image_path);
  let stem = image_path.file_stem().unwrap().to_str().unwrap();
  let image_fmt = match image::ImageFormat::from_path(image_path) {
    Ok(image_fmt) => image_fmt,
    Err(_) => return Err("不是图片".to_string()),
  };

  // 找到字幕文件对应的路径
  let caption_path = image_path.with_extension(caption_ext);

  // 打开图片
  let img = image::open(image_path).expect("无法打开图片");

  // 缩放图像, 将图像缩放到 width / height * row_height
  let width = img.width();
  let height = img.height();
  let nheight = ((height as f32) / (width as f32) * (image_width as f32)) as u32;
  // 不使用 resize, 改用缩略图
  let img = img.thumbnail(image_width, nheight);
  let base64_str = image_to_base64(&img, image_fmt);


  // 读取字幕标签
  let tags = match File::open(caption_path) {
    Ok(mut f) => {
      let mut contents = String::new();
      match f.read_to_string(&mut contents) {
        Ok(_) => contents.split(',').map(|word|  word.trim().to_owned() ).filter(|word| word.len() > 0).collect::<Vec<_>>(),
        Err(_) => vec![],
      }
    },
    Err(_) => vec![],
  };

  Ok(ImageInfoWithCaptions {
    src: base64_str, 
    width,
    height,
    filename: stem.to_owned(),
    captions: tags,
    path: image_path.to_owned(),

  })
}

#[tauri::command]
fn load_image(image_path: &str) -> Result<ImageInfo, String> {
  let image_path = Path::new(image_path);
  let stem = image_path.file_stem().unwrap().to_str().unwrap();
  let image_fmt = match image::ImageFormat::from_path(image_path) {
    Ok(image_fmt) => image_fmt,
    Err(_) => return Err("不是图片".to_string()),
  };

  // 打开图片
  let img = image::open(image_path).expect("无法打开图片");
  // 干脆不缩放了
  let base64_str = image_to_base64(&img, image_fmt);

  // 不加载字幕了
  Ok(ImageInfo {
    src: base64_str, 
    width: img.width(),
    height: img.height(),
    filename: stem.to_owned(),
    path: image_path.to_owned(),

  })
}



// 增加一个函数, 首先读取所有的图片文件名
#[tauri::command]
fn glob_images(imagedir: &str) -> Result<Vec<ImagePathInfo>, String> {
  // 读取 imagedir 目录下的所有图片, 并缩放到 row_height, 然后转换为 base64 格式在前端渲染.
  let entries = match fs::read_dir(imagedir) {
    Ok(entries) => entries,
    Err(_) => return Err(format!("failed to read path '{}'", imagedir)),
  };
  let mut result = Vec::new();
  for entry in entries {
    if let Ok(entry) = entry {
      let file_path = entry.path();
      if let (Some(ext), Some(stem)) = (file_path.extension(), file_path.file_stem()) {
        if let (Some(_), Some(stem), Some(ext)) = (image::ImageFormat::from_extension(ext), stem.to_str(), ext.to_str()) {
          // 是图片, 那么将路径添加进去
          result.push(ImagePathInfo {
            filename: stem.to_string(),
            stem: stem.to_string(),
            filepath: file_path.to_owned(),
            extension: ext.to_string(),
          });
        }
      }
    }
  }

  Ok(result)
}

#[tauri::command]
fn save_captions(imagedir: PathBuf, captions: Vec<ImageSaveInfo>, caption_ext: &str) -> Result<(), String> {
  // 全部保存即可
  captions.iter().for_each(|image_save_info| {
    let caption_path = imagedir.join(Path::new(&format!("{}.{}", image_save_info.filename, caption_ext)));
    let mut file = File::create(&caption_path).expect("无法创建文件");
    let content = image_save_info.captions.join(", ");
    file.write_all(content.as_bytes()).unwrap();
  });
  Ok(())
}





fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![check_path, load_thumbnail_with_captions, glob_images, load_image, save_captions])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
