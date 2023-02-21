import { upload } from "./upload"

import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbUZdDCJq0xk1G2jBXr8v686qAmoAOkKY",
  authDomain: "minin-zagruzka-failov.firebaseapp.com",
  projectId: "minin-zagruzka-failov",
  storageBucket: "minin-zagruzka-failov.appspot.com",
  messagingSenderId: "60360165024",
  appId: "1:60360165024:web:fc2a2f39adbf83881b6bc5"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

console.log(storage)


upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', snapshot => {
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = progress
        block.style.width = progress
        console.log('Upload is ' + progress + '% done')
      }, error => {
        console.log(error)
      }, () => {
        console.log('Complete')
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        })
      })
    })
  }
})