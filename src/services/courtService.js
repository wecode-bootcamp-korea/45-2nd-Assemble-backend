const courtDao = require('../models/courtDao');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const getCourtList = async (
  districtId,
  date,
  time,
  parkingId,
  rentalEquip,
  showerFacility,
  hasAmenities,
  courtTypeId,
  courtId,
  page,
  orderBy,
  dateForCourt
) => {
  const getCourtList = await courtDao.getCourtList(
    districtId,
    date,
    time,
    parkingId,
    rentalEquip,
    showerFacility,
    hasAmenities,
    courtTypeId,
    courtId,
    page,
    orderBy,
    dateForCourt
  );

  return getCourtList;
};

const getHostingCourts = async (userId) => {
  return await courtDao.getHostingCourts(userId);
};

const createCourt = async (userId, image, name, address, price) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
  });

  const uploadedImage = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `courtImages/${uuidv4()}`,
      Body: image.buffer,
    })
    .promise();

  await courtDao.createCourt(
    userId,
    uploadedImage.Location,
    name,
    address,
    price
  );

  return uploadedImage.Location;
};

module.exports = {
  getCourtList,
  getHostingCourts,
  createCourt,
};
