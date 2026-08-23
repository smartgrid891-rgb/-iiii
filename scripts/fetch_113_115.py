import urllib.parse

url113 = "https://tcloud2.sanmin.com.tw/DocUploads/Earth/113學測地科解析PDF.pdf"
url114_raw = "https://tcloud2.sanmin.com.tw/DocUploads/Earth/【三民書局】114學年度學測地科試題解析.pdf"
url115 = "https://www.ceec.edu.tw/files/file_pool/1/0q054346117821958325/06-115學測自然試卷.pdf"

# URL-encode path portion for 114
parsed = urllib.parse.urlsplit(url114_raw)
encoded_path = urllib.parse.quote(parsed.path)
url114 = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, encoded_path, parsed.query, parsed.fragment))

print("URL113:", url113)
print("URL114:", url114)
print("URL115:", url115)
