import ImageKit from '@imagekit/nodejs';

// TODO: Add ImageKit env vars
// const imagekit = new ImageKit({
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
// });

let imagekit = null;
if (process.env.IMAGEKIT_PRIVATE_KEY) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/your_id"
  });
}

export default imagekit;
