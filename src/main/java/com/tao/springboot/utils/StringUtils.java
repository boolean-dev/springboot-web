package com.tao.springboot.utils;

import com.tao.springboot.entity.Translation;

import java.util.List;

/**
 * 字符串工具类
 * @author tao
 *
 */
public final class StringUtils {

	/** 
	 * 将下划线方式命名的字符串转换为驼峰式。如果转换前的下划线大写方式命名的字符串为空，则返回空字符串。</br> 
	 * 例如：HELLO_WORLD->HelloWorld 
	 * @param name 转换前的下划线大写方式命名的字符串 
	 * @return 转换后的驼峰式命名的字符串 
	 */  
	public static String camelName(String name) {  
	    StringBuilder result = new StringBuilder();  
	    // 快速检查  
	    if (name == null || name.isEmpty()) {  
	        // 没必要转换  
	        return "";  
	    } else if (!name.contains("_")) {  
	        // 不含下划线，仅将首字母小写  
	        return name.substring(0, 1).toLowerCase() + name.substring(1);  
	    }  
	    // 用下划线将原始字符串分割  
	    String camels[] = name.split("_");  
	    for (String camel :  camels) {  
	        // 跳过原始字符串中开头、结尾的下换线或双重下划线  
	        if (camel.isEmpty()) {  
	            continue;  
	        }  
	        // 处理真正的驼峰片段  
	        if (result.length() == 0) {  
	            // 第一个驼峰片段，全部字母都小写  
	            result.append(camel.toLowerCase());  
	        } else {  
	            // 其他的驼峰片段，首字母大写  
	            result.append(camel.substring(0, 1).toUpperCase());  
	            result.append(camel.substring(1).toLowerCase());  
	        }  
	    }  
	    return result.toString();  
	}  
	
	
	public static String toJson(List<Translation> list) {
//		List<Object> list = Arrays.asList(objects);
		int size = list.size();
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		for(int i=0; i<size; i++) {
			Translation translation = list.get(i);
			if(i==size-1) {
				if(translation.getIsString()) {
					sb.append("\"").append(translation.getName()).append("\"").append(":\"").append(translation.getValue()).append("\"}");
				}else {
					sb.append("\"").append(translation.getName()).append("\"").append(":").append(translation.getValue()).append("}");
				}
				
			}else {
				if(translation.getIsString()) {
					sb.append("\"").append(translation.getName()).append("\"").append(":\"").append(translation.getValue()).append("\",");
				}else {
					sb.append("\"").append(translation.getName()).append("\"").append(":").append(translation.getValue()).append(",");
				}
				
			}
		}
		return sb.toString();
	}
}
