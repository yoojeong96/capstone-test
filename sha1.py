import os, sys
import hashlib
import json
from datetime import datetime

 
def getHash(path, blocksize=65536):
    afile = open(path, 'rb')
    hasher = hashlib.sha1()
    buf = afile.read(blocksize)
    while len(buf) > 0:
        hasher.update(buf)
        buf = afile.read(blocksize)
    afile.close()
    return hasher.hexdigest()

 
def getHashMd(path, blocksize=65536):
    afile = open(path, 'rb')
    hasher = hashlib.md5()
    buf = afile.read(blocksize)
    while len(buf) > 0:
        hasher.update(buf)
        buf = afile.read(blocksize)
    afile.close()
    return hasher.hexdigest()

    
def writeJSON(path, fileHash, data):
    
    filePathNameWExt = './' + path + '/' + fileHash + '.json'
    with open(filePathNameWExt, 'w') as f:
        json.dump(data, f)
    
 
file = sys.argv[1]
 
if os.path.exists(file):
    fileHash = getHash(file)
    fileHashMd = getHashMd(file)
    
    data = {}
    data['sha1'] = fileHash
    data['MD5'] = fileHashMd
    
    # print(fileHash)
    
    writeJSON('./', 'fileHash' , data)
    
else:
    print('%s is not a valid path, please verify' % file)
    sys.exit()