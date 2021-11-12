const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const dotenv = require("dotenv");
dotenv.config();
const upload = require("../S3/s3");
const { db } = require("../models/index");

// 개스타그램 글 등록하기
router.post("/write", upload.single("dogPostImage"), auth, async (req, res) => {
  const userId = res.locals.user.userId;

  try {
    console.log("req.body", req.body);
    const { dogPostDesc } = req.body;

    const dogPostImage = req.file.location;

    console.log("dogPostImage:", dogPostImage);

    const params = [dogPostDesc, dogPostImage, userId];

    const query = `INSERT INTO dogSta(dogPostDesc, dogPostImage, userId) VALUES(?,?,?)`;
    // console.log("여기까지 오나 실험", query)

    await db.query(query, params, (error, rows, fields) => {
      if (error) {
        return res.status(400).json({
          success: false,
          msg: "개스타그램 등록 실패!",
        });
      }
      return res.status(201).json({
        success: true,
        msg: "개스타그램 등록 성공!",
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "로그인 하세요",
    });
  }
});

// 개스타그램 조회하기 -> 마이페이지 누르면 보이는 화면
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  let existDogPost;
  const dogPost = `SELECT * FROM dogSta WHERE dogSta.userId = "${userId}"`;
  const results = await db.query(dogPost);
  existDogPost = results[0];

  console.log("existDogPost", existDogPost);

  //작성된 개스타그램 post가 없다면
  if (!existDogPost) {
    //유저 정보 보내준다
    const query = `SELECT user.userId, user.userNickname, user.userImage, user.userLocation FROM user WHERE user.userId = "${userId}";`;

    await db.query(query, (error, rows) => {
      if (error) {
        return res.status(400).json({
          success: false,
          msg: "개스타그램 조회 실패!",
        });
      }
      return res.status(200).json({
        success: true,
        posts: rows,
      });
    });
  } else {
    // 유정 정보와 개스타그램 post 정보를 다 보내준다.
    // 내림차순으로 정렬(최신순으로)
    const query = `SELECT dogSta.dogPostId, dogSta.dogPostImage, dogSta.dogPostDesc, dogSta.createdAt, dogSta.userId, 
    user.userNickname, user.userImage, user.userLocation
    FROM dogSta
    LEFT JOIN user 
    ON dogSta.userId = user.userId
    WHERE dogSta.userId= "${userId}"
    ORDER BY dogSta.createdAt DESC`;

    console.log("query", query);

    await db.query(query, (error, rows) => {
      if (error) {
        return res.status(400).json({
          success: false,
          msg: "개스타그램 조회 실패!",
        });
      }
      return res.status(200).json({
        success: true,
        posts: rows,
      });
    });
  }
});

// 개스타그램 상세 조회하기
router.get("/:userId/:dogPostId", async (req, res) => {
  const { userId, dogPostId } = req.params;

  try {
    //유정 정보와 개스타그램 post 정보를 다 보내준다.
    const query = `SELECT dogSta.dogPostId, dogSta.dogPostImage, dogSta.dogPostDesc, dogSta.createdAt, dogSta.userId, 
	user.userNickname, user.userImage, user.userLocation
    FROM dogSta 
    LEFT JOIN user 
    ON dogSta.userId = user.userId 
    WHERE dogSta.userId = "${userId}"
    AND dogSta.dogPostId= "${dogPostId}"`;

    await db.query(query, (error, rows) => {
      if (error) {
        return res.status(400).json({
          success: false,
          msg: "상세 조회하기 실패",
        });
      }
      return res.status(200).json({
        posts: rows,
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// 강아지 정보 수정하기
router.patch(
  "/:dogPostId",
  upload.single("dogPostImage"),
  auth,
  async (req, res) => {
    try {
      const userId = res.locals.user.userId;
      const { dogPostId } = req.params;

      const { dogPostDesc } = req.body;

      //const dogIPostImage = req.file.location;

      const escapeQuery = {
        dogPostDesc: dogPostDesc,
      };

      const query = `UPDATE dogSta SET ? WHERE dogSta.dogPostId = ${dogPostId} and dogSta.userId = '${userId}'`;

      await db.query(query, escapeQuery, (error, rows, fields) => {
        if (error) {
          return res.status(400).json({
            success: false,
            msg: "수정하기 실패!",
          });
        } else {
          return res.status(200).json({
            success: true,
            dogs: rows,
          });
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "로그인 하세요",
      });
    }
  }
);

//개스타그램 글 삭제하기
router.delete("/:dogPostId", auth, async (req, res) => {
  const userId = res.locals.user.userId;
  const { dogPostId } = req.params;

  const query = `DELETE from dogSta where dogSta.dogPostId = '${dogPostId}' and dogSta.userId = '${userId}'`;
  try {
    await db.query(query, (error, rows, fields) => {
      if (error) {
        return res.status(400).json({
          success: false,
        });
      }
      return res.status(200).json({
        success: true,
      });
    });
  } catch (err) {
     res.status(500).json({ 
        success: false,
        msg: "로그인 하세요" 
    });
  }
});


// 개스타그램 메인 조회하기
router.get("/", async (req, res) => {
  try {
    //유정 정보와 개스타그램 post 정보를 다 보내준다.
    const query = `SELECT * FROM dogSta 
      JOIN user
      ON dogSta.userId = user.userId
      ORDER BY dogSta.createdAt DESC`;

    await db.query(query, (error, rows) => {
      if (error) {
        return res.status(400).json({
          success: false,
          msg: "메인 조회하기 실패",
        });
      }
      return res.status(200).json({
        success: true,
        posts: rows,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "로그인 하세용",
    });
  }
});

module.exports = router;