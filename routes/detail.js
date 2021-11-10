const express = require('express');
const multer = require('multer')
const router = express.Router();
const auth = require('../middlewares/auth'); 
const { db } = require("../models/index");
const dotenv = require('dotenv');
const { ConnectContactLens } = require('aws-sdk');
dotenv.config();
// const util = require('util'); //현재시간을 찍어주는 모듈 
// const { JsonWebTokenError } = require('jsonwebtoken');


//산책 약속페이지 등록하기
router.post('/write', auth, async (req, res) => {
  console.log("write post 연결완료!")
  const completed = false;
  const userId = res.locals.user.userId;
  try {
    const {meetingDate,wishDesc,locationCategory, dogCount,startTime,endTime,startLongitude,startLatitude,startLocationAddress,endLongitude,endLatitude,endLocationAddress,totalDistance} = req.body;
    const params= [
      meetingDate,
      wishDesc,
      completed,
      locationCategory,
      dogCount,
      startTime,
      endTime,
      startLongitude,
      startLatitude,
      startLocationAddress,
      endLongitude,
      endLatitude,
      endLocationAddress,
      totalDistance,
      userId
    ];  
    const query =
    'INSERT INTO post (meetingDate,wishDesc,completed,locationCategory,dogCount,startTime,endTime,startLongitude,startLatitude,startLocationAddress,endLongitude,endLatitude,endLocationAddress,totalDistance,userId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      await db.query(query, params, (error, rows, fields) => {
        console.log("row는",rows)
        if (error) {
          console.log(error)
          // logger.error(`Msg: raise Error in createPost => ${error}`);
          return res.status(400).json({
            success: false,
            errMessage: '400 에러 게시중 오류가 발생 하였습니다!.'
          });
        }
        // logger.info(`${userNickname}님, 게시글 등록이 완료되었습니다.`);
        return res.status(201).json({
          success: true,
          Message: '게시글이 성공적으로 포스팅 되었습니다!.'
        });
      });
    } catch (err) {
      // logger.error('게시글 작성 중 발생한 에러: ', err);
      return res.status(500).json({
        success: false,
        errMessage: '500 에러 게시중 오류가 발생 하였습니다!.'
      });     
    }
  })


//산책 약속 상세 조회하기
router.get('/:postId', auth, function (req, res, next) {
  const {postId} = req.params;
  const userId = res.locals.user.userId;
  console.log("get method 연결완료!")
  try {
    const query = 
    `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage,
    post.userId, post.postId, post.meetingDate, post.wishDesc, post.locationCategory, post.dogCount, post.createdAt, post.completed, post.startTime, post.endTime, post.startLongitude, post.startLatitude, post.startLocationAddress, post.endLongitude, post.endLatitude, post.endLocationAddress, post.totalDistance, 
    user.userNickname, user.userGender, user.userAge, user.userImage,user.userId
    from post
    join dog
    on post.userId = dog.userId
    join user
    on user.userId = dog.userId
    WHERE post.postId =${postId}`;
    db.query(query, (error, rows) => {
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 발생한 DB관련 에러', error);
        return res.sendStatus(400);
      }
      // logger.info('게시글을 성공적으로 조회했습니다.');
      res.status(200).json({
        success: true,
        posts: rows[0],
      });
      console.log("rows는", rows[0])
    });
  } catch (err) {
    // logger.error('게시글 조회하기 중 발생한 예상하지 못한 에러: ', err);
    return res.sendStatus(500);
  }
});


//메인 조회하기 - 필터포함!
router.get('/', function (req, res, next) {
  let conditions = [];
  let where
  console.log("get method 연결완료!")
  // const dogSize = "소형견";
  // const dogGender = '남';
  const {dogSize, dogGender, dogAge, locationCategory, completed} = req.body;
  console.log(dogSize, dogGender, dogAge, locationCategory, completed)

  //카테고리 필터 
  if(dogSize !== 'undefined'){
    conditions.push(`dogSize = '${dogSize}'`);
  }
  if(dogGender !== 'undefined'){
    conditions.push(`dogGender = '${dogGender}'`);
  }
  if(dogAge !== 'undefined'){
    conditions.push(`dogAge = '${dogAge}'`);
  }
  if(locationCategory !== 'undefined'){
    conditions.push(`locationCategory = '${locationCategory}'`);
  }
  if(completed !== 'undefined'){
    conditions.push(`completed = '${completed}'`);
  }
  where = conditions.join(' AND ' );
  console.log('where', where);

  //if절 test 추후 삭제 필요
  // if (locationCategory == undefined) {
  //   console.log(1)
  // } else (console.log(2))
  // let {selected_category} =req.body
  // const [filter, subfilter] = selected_category.split("_");
  // console.log(filter) //all 을 했을때 안쓰게 하는 방법!

  console.log(3)
  try {
    console.log(4)
    //1) 1번 쿼리
    // const query = 
    // `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    // post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory  
    // FROM post
    // JOIN dog
    // ON dog.userId=post.userId
    // WHERE 1
    // AND dog.dogSize = '${dogSize}' 
    // AND dog.dogGender = '${dogGender}'
    // AND dog.dogAge = '${dogAge}'
    // AND post.locationCategory = '${locationCategory}'
    // AND post.completed = '${completed}'
    // `;

    // //2번 쿼리
    // const query = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    // post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory  
    // FROM post
    // JOIN dog
    // ON dog.userId=post.userId
    // WHERE
    // (CASE
    //   when (dogSize != '')
    //     // then dog.dogSize = '${dogSize}'
    //   when (dogSize != '' )
    //     then dog.dogGender = '${dogGender}'
    //   when (dogAge != '')
    //     then dog.dogAge = '${dogAge}'
    //   when (locationCategory != '')
    //     then post.locationCategory = '${locationCategory}'
    //   when (completed != '')
    //     then post.completed = '${completed}'
    // END)
    // `

    const query = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory  
    FROM post
    JOIN dog
    ON dog.userId=post.userId
    WHERE ` + where 

    // const query2 = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    // post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory  
    // FROM post
    // JOIN dog
    // ON dog.userId=post.userId
    // WHERE `

    console.log('query', typeof query);
    // console.log('query', typeof query2);

    console.log('5');

    db.query(query, (error, rows) => {
      console.log('6');
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 발생한 DB관련 에러', error);
        return res.sendStatus(400);
      }

      console.log('7');
      // logger.info('게시글을 성공적으로 조회했습니다.');
      res.status(200).json({
        success: true,
        posts: rows,
      });
      console.log("rows는", rows)
    });

  } catch (err) {
    // logger.error('게시글 조회하기 중 발생한 예상하지 못한 에러: ', err);
    return res.sendStatus(500);
  }
});

//산책 게시물 수정하기
router.patch('/:postId',auth, async (req, res) => {
  const postId = req.params.postId;
  const userId = res.locals.user.userId;
  const { locationCategory, meetingDate, wishDesc, dogCount, startLongitude, startLatitude, endLongitude, endLatitude,startLocationAddress,endLocationAddress,completed,totalDistance,startTime,endTime} = req.body;
  const escapeQuery = {
    locationCategory: locationCategory,
    meetingDate: meetingDate,
    wishDesc: wishDesc,
    startLongitude:startLongitude,
    startLatitude:startLatitude,
    startLocationAddress:startLocationAddress,
    endLongitude:endLongitude,
    endLatitude:endLatitude,
    endLocationAddress:endLocationAddress,
    dogCount:dogCount,
    totalDistance:totalDistance,
    startTime:startTime,
    endTime:endTime,
    completed:completed,
  };
  const query = `UPDATE post SET ? WHERE postId = ${postId} and userId = '${userId}'`;
  await db.query(query, escapeQuery, (error, rows, fields) => {
    console.log(rows)
    if (error) {
      console.log(error)
      // logger.error('게시글 수정 중 발생한 DB관련 에러: ', error);
      return res.status(400).json({
        success: false,
        error,
      });
    } else {
      console.log("rows",rows)
      // logger.info('게시글을 성공적으로 수정하였습니다.');
      return res.status(200).json({
        success: true,
        posts: rows,
      });
    }
  });
});

//유저가 마감 하기 
router.patch('/completion/:postId', auth, async (req, res) => {
  console.log("마감여부 접속 완료 ")
  try {
  const postId = req.params.postId;
  const userEmail = res.locals.user.userEmail;
  console.log("user_email",userEmail)
  const userId = res.locals.user.userId;
  const {completed} = req.body;
  const escapeQuery = {
    completed:completed
  }
  const query = `UPDATE post SET ? WHERE postId = ${postId} and userId = '${userId}'`;
  await db.query(query, escapeQuery, (error,rows,fields) => {
    if (error) {
      console.log("에러는", error)
      // logger.error('게시글 수정 중 발생한 DB관련 에러: ', error);
      return res.status(400).json({
        success: false,
        error,
      });
    } else {
      return res.status(200).json({
        success: true,
      })
    }
  })
} catch (err) {
  // logger.error('게시글 조회하기 중 발생한 예상하지 못한 에러: ', err);
  return res.sendStatus(500);
}
})


// 게시글 삭제
router.delete('/:postId', auth, async (req, res) => {
  const  postId  = req.params.postId;
  const userId = res.locals.user.userId;

  const query = `DELETE from post where postId = ${postId} and userId = '${userId}'`;
  try {
    await db.query(query, (error, rows, fields) => {
      if (error) {
        // logger.error('게시글 삭제 중 쿼리문 에러가 발생하였습니다. :', error);
        return res.status(400).json({
          success: false,
        });
      }
      // logger.info('게시글을 성공적으로 삭제하였습니다.');
      res.status(200).json({
        success: true,
      });
    });
  } catch (err) {
    res.status(500).json({ err: err });
  }
});




module.exports = router;