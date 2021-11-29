const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const auth = require('../middlewares/auth');
const { db } = require("../models/index");
=======
const auth = require('../middlewares/auth'); 
const ctrl = require("../controllers/post/post.ctrl");
>>>>>>> eujeong
const dotenv = require('dotenv');
// const { ConnectContactLens } = require('aws-sdk');
// const logger = require("../src/config/logger")
dotenv.config();
// const util = require('util'); //현재시간을 찍어주는 모듈
// const { JsonWebTokenError } = require('jsonwebtoken');

//메인 조회하기 - 올림픽 공원
router.get('/olympicPark', function (req, res, next) {
  let conditions = [];
  let where
  console.log("get method 연결완료!")
  const {dogSize, dogGender, dogAge, locationCategory, completed} = req.body;
  console.log(dogSize, dogGender, dogAge, locationCategory, completed)
  const location = "올림픽공원"
  try {

    const query = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory
    FROM post
    JOIN dog
    ON dog.userId=post.userId
    where post.locationCategory ='${location}'
    ORDER BY post.createdAt DESC `
    console.log('query',query);

    db.query(query, (error, rows) => {
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 DB관련 에러가 발생했습니다', error);
        return res.sendStatus(400);
      }
      // logger.info('게시글을 성공적으로 조회했습니다.');
      res.status(200).json({
        success: true,
        posts: rows,
      });
      console.log("rows는", rows)
    });

  } catch (err) {
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
    return res.sendStatus(500);
  }
});

//메인 조회하기 - 반포 한강공원
router.get('/banpoPark', function (req, res, next) {
  let conditions = [];
  let where
  console.log("get method 연결완료!")
  const {dogSize, dogGender, dogAge, locationCategory, completed} = req.body;
  console.log(dogSize, dogGender, dogAge, locationCategory, completed)
  const location = "반포한강공원"
  try {

    const query = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory
    FROM post
    JOIN dog
    ON dog.userId=post.userId
    where post.locationCategory ='${location}'
    ORDER BY post.createdAt DESC `
    console.log('query', typeof query);

    db.query(query, (error, rows) => {
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 DB관련 에러가 발생했습니다', error);
        return res.sendStatus(400);
      }
      // logger.info('게시글을 성공적으로 조회했습니다.');
      res.status(200).json({
        success: true,
        posts: rows,
      });
      console.log("rows는", rows)
    });

  } catch (err) {
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
    return res.sendStatus(500);
  }
});

//메인 조회하기 - 서울숲
router.get('/seoulForest', function (req, res, next) {
  let conditions = [];
  let where
  console.log("get method 연결완료!")
  const {dogSize, dogGender, dogAge, locationCategory, completed} = req.body;
  console.log(dogSize, dogGender, dogAge, locationCategory, completed)
  try {

    const query = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory
    FROM post
    JOIN dog
    ON dog.userId=post.userId
    where post.locationCategory ="서울숲"
    ORDER BY post.createdAt DESC`
    console.log('query', typeof query);

    db.query(query, (error, rows) => {
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 DB관련 에러가 발생했습니다', error);
        return res.sendStatus(400);
      }
      res.status(200).json({
        success: true,
        posts: rows,
      });
      console.log("rows는", rows)
      // logger.info('게시글을 성공적으로 조회했습니다.');
    });

  } catch (err) {
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
    return res.sendStatus(500);
  }
});


//산책 약속페이지 등록하기
router.post('/write', auth, async (req, res) => {
  console.log("write post 연결완료!")
  const completed = 0;
  const userId = res.locals.user.userId;
  try {
    const {meetingDate,wishDesc,locationCategory, dogCount,totalTime,startLocationAddress,endLocationAddress,totalDistance,routeColor,routeName} = req.body;
    console.log(meetingDate)
    const params= [
      meetingDate,
      wishDesc,
      completed,
      locationCategory,
      dogCount,
      totalTime,
      startLocationAddress,
      endLocationAddress,
      totalDistance,
      routeColor,
      routeName,
      userId,
    ];
    const query =
    'INSERT INTO post (meetingDate,wishDesc,completed,locationCategory,dogCount,totalTime,startLocationAddress,endLocationAddress,totalDistance,routeColor,routeName, userId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
      await db.query(query, params, (error, rows, fields) => {
        console.log("row는",rows)
        if (error) {
          console.log(error)
          // logger.error('게시글 저장 중 DB관련 에러가 발생 했습니다', error);
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
      // logger.error('게시글 작성 중 에러가 발생 했습니다: ', err);
      return res.status(500).json({
        success: false,
        errMessage: '500 에러 게시중 오류가 발생 하였습니다!.'
      });
    }
  })


//산책 약속 상세 조회하기
router.get('/:postId', auth, function (req, res, next) {
  const {postId} = req.params;
  // const userId = res.locals.user.userId;
  console.log("get method 연결완료!")
  try {
    const query =
    `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage,
    post.userId, post.postId, post.meetingDate, post.wishDesc, post.locationCategory, post.dogCount, post.createdAt, post.completed, post.totalTime, post.startLocationAddress, post.endLocationAddress, post.totalDistance, post.routeColor, post.routeName,
    user.userNickname, user.userGender, user.userAge, user.userImage,user.userId,
    (SELECT
      CASE
      WHEN TIMESTAMPDIFF(MINUTE, post.createdAt,NOW())<=0 THEN '방금 전'
      WHEN TIMESTAMPDIFF(MINUTE, post.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, post.createdAt, NOW()), '분 전')
      WHEN TIMESTAMPDIFF(HOUR, post.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, post.createdAt, NOW()), '시간 전')
      WHEN TIMESTAMPDIFF(DAY, post.createdAt, NOW()) < 7 THEN CONCAT(TIMESTAMPDIFF(Day, post.createdAt, NOW()), '일 전')
      ELSE post.createdAt
      END) AS AGOTIME
    from post
    join dog
    on post.userId = dog.userId
    join user
    on user.userId = dog.userId
    WHERE post.postId ='${postId}'`;
    db.query(query, (error, rows) => {
      console.log("들어가니",rows)
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 DB관련 에러가 발생했습니다', error);
        return res.sendStatus(400);
      }
      // logger.info('게시글을 성공적으로 조회했습니다.');
      res.status(200).json({
        success: true,
        posts: rows[0],
      });
      console.log("rows는", rows)
    });
  } catch (err) {
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
    return res.sendStatus(500);
  }
});


//메인 조회하기 - 전체 조회하기
router.get('/', function (req, res, next) {
  let conditions = [];
  let where
  console.log("get method 연결완료!")
  const {dogSize, dogGender, dogAge, locationCategory, completed} = req.body;
  console.log(dogSize, dogGender, dogAge, locationCategory, completed)
  try {

    const query = `SELECT
    dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory
    FROM post
    JOIN dog
    ON dog.userId=post.userId
    ORDER BY post.createdAt DESC`
    console.log('query', typeof query);
    db.query(query, (error, rows) => {
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 DB관련 에러가 발생했습니다', error);
        return res.sendStatus(400);
      }
      // logger.info('게시글을 성공적으로 조회했습니다.');
      res.status(200).json({
        success: true,
        posts: rows,
      });
      console.log("rows는", rows)
    });

  } catch (err) {
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
    return res.sendStatus(500);
  }
});

//카테고리 전체 조회
router.get('/category', function (req, res, next) {
  let conditions = [];
  let where
  console.log("get method 연결완료!")
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

  try {
    console.log(4)
    const query = `SELECT dog.dogId, dog.dogGender, dog.dogName, dog.dogSize, dog.dogBreed, dog.dogAge, dog.neutral, dog.dogComment, dog.dogImage, dog.userId,
    post.userId, post.postId, post.meetingDate, post.completed, post.locationCategory
    FROM post
    JOIN dog
    ON dog.userId=post.userId
    WHERE ` + where
    console.log('query', typeof query);
    db.query(query, (error, rows) => {
      if (error) {
        console.log(error)
        // logger.error('게시글 조회 중 DB관련 에러가 발생했습니다', error);
        return res.sendStatus(400);
      }
      res.status(200).json({
        success: true,
        posts: rows,
      });
      console.log("rows는", rows)
      // logger.info('게시글을 성공적으로 조회했습니다.');
    });

  } catch (err) {
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
    return res.sendStatus(500);
  }
});


//산책 게시물 수정하기
router.patch('/:postId',auth, async (req, res) => {
  try{
  const postId = req.params.postId;
  const userId = res.locals.user.userId;
  const {locationCategory, meetingDate, wishDesc, dogCount,startLocationAddress,endLocationAddress,completed,totalDistance,totalTime,routeColor,routeName} = req.body;
  const escapeQuery = {
    locationCategory: locationCategory,
    meetingDate: meetingDate,
    wishDesc: wishDesc,
    dogCount:dogCount,
    startLocationAddress:startLocationAddress,
    endLocationAddress:endLocationAddress,
    completed:completed,
    totalDistance:totalDistance,
    totalTime:totalTime,
    totalDistance:totalDistance,
    routeColor:routeColor,
    routeName:routeName,
    // coordinate:coordinate
  };
  const query = `UPDATE post SET ? WHERE postId = ${postId} and userId = '${userId}'`;
  await db.query(query, escapeQuery, (error, rows, fields) => {
    console.log(rows)
    if (error) {
      console.log(error)
      // logger.error('게시글 수정 중 DB관련 에러가 발생했습니다', error);
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
} catch (err) {
  // logger.error('게시물 수정하기 중 예상하지 못한 에러가 밣생 했습니다', err);
  return res.sendStatus(500);
}
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
      // logger.error('마감 여부 설정 중 DB관련 에러가 발생했습니다', error);
      return res.status(400).json({
        success: false,
        error,
      });
    } else {
      // logger.info('마감 여부가 성공적으로 바뀌었습니다');
      return res.status(200).json({
        success: true,
      })
    }
  })
} catch (err) {
  // logger.error('마감 여부 설정 중 예상하지 못한 에러가 밣생 했습니다', err);
  return res.sendStatus(500);
}
})

//산책인원 카운트 하기
// router.post('/completed/:postId', auth, async (req, res) => {
//   const {postId} =req.params;
//   //
//   const userId = res.locals.user.userId;
//   try {
//     const {meetingDate,wishDesc,locationCategory, dogCount,totalTime,startLocationAddress,endLocationAddress,totalDistance,routeColor,routeName} = req.body;
//     console.log(meetingDate)
//     const params= [
//       meetingDate,
//       wishDesc,
//       completed,
//       locationCategory,
//       dogCount,
//       totalTime,
//       startLocationAddress,
//       endLocationAddress,
//       totalDistance,
//       routeColor,
//       routeName,
//       userId,
//     ];
//     const query =
//     'INSERT INTO post (meetingDate,wishDesc,completed,locationCategory,dogCount,totalTime,startLocationAddress,endLocationAddress,totalDistance,routeColor,routeName, userId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
//       await db.query(query, params, (error, rows, fields) => {
//         console.log("row는",rows)
//         if (error) {
//           console.log(error)
//           // logger.error('게시글 저장 중 DB관련 에러가 발생 했습니다', error);
//           return res.status(400).json({
//             success: false,
//             errMessage: '400 에러 게시중 오류가 발생 하였습니다!.'
//           });
//         }
//         // logger.info(`${userNickname}님, 게시글 등록이 완료되었습니다.`);
//         return res.status(201).json({
//           success: true,
//           Message: '게시글이 성공적으로 포스팅 되었습니다!.'
//         });
//       });
//     } catch (err) {
//       // logger.error('게시글 작성 중 에러가 발생 했습니다: ', err);
//       return res.status(500).json({
//         success: false,
//         errMessage: '500 에러 게시중 오류가 발생 하였습니다!.'
//       });
//     }
//   })



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
    // logger.error('게시글 조회 중 에러가 발생 했습니다: ', err);
  }
});

module.exports = router;
