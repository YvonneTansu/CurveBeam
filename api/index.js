var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');

router.post('/insert-child', async (req, res) => {
  try{
    if (req.body.name && req.body.class && req.body.cars) {
      let name = sanitizeHtml(req.body.name);
      let child_class = sanitizeHtml(req.body.class);
      let cars = req.body.cars;
      let carSize = cars.length;
      
      const pool = await req.pool;
      const request = await pool.request();

      // Check if email is already used
      let query = `BEGIN;
      declare @id NVARCHAR(255);
      SELECT @id = ID FROM "User" WHERE name = '${name}';
      IF @id IS NULL
          BEGIN;
          SET @id=NEWID();
          INSERT INTO "User" (ID, name, class) VALUES (@id,'${name}','${child_class}');
          SELECT @id AS ID
          END;
      ELSE
          SELECT @id AS ID
      END;`;
      let response = await request.query(query);
      if (response.recordset.length == 0) {
        console.error("INSERT: format is wrong");
        res.status(400).send("Please check your child name and class again.");
      }
      else {
        let id = response.recordset[0].ID;
        for (let i = 0; i < carSize; i++) {
          let query = `INSERT INTO "Car" (child, reg_no) VALUES ('${id}', '${cars[i]}');`
          let response = await request.query(query);
          if (response.rowsAffected.length == 0) {
            console.error("INSERT: format is wrong");
            res.status(400).send("Please check your car registration number again.");
            res.end();
          }
        }
        res.status(200).send(response);
      }
    }
    else {
      // Email and/or password missing
      console.error("LOGIN: Name and/or Class and/or Car missing");
      res.status(400).send("Please input name, class and car.");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

router.get('/search-child', async (req, res) => {
  try{
    if (req.query.car) {
      let car = sanitizeHtml(req.query.car);
      
      const pool = await req.pool;
      const request = await pool.request();

      // Check if email is already used
      let query = `BEGIN;
      declare @id NVARCHAR(255);
      SELECT @id = child FROM "Car" WHERE reg_no = '${car}';
      SELECT ID, name, class, hasLeft FROM "User" WHERE ID = @id;
      END;`;
      let response = await request.query(query);
      if (response.recordset.length == 0) {
        console.error("INSERT: format is wrong");
        res.status(400).send("Please check your car again.");
      }
      else {
        res.status(200).send(response.recordset[0]);
      }
    }
    else {
      console.error("SEARCH: car not inputted");
      res.status(400).send("Please input car.");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

router.post('/mark-left', async (req, res) => {
  try{
    if (req.body.child) {
      let child = sanitizeHtml(req.body.child);
      
      const pool = await req.pool;
      const request = await pool.request();

      // Check if email is already used
      let query = `
          UPDATE "User"
          SET hasLeft = 1
          WHERE ID = '${child}';`;
      let response = await request.query(query);
      if (response.rowsAffected.length == 0) {
        console.error("MARK LEFT: failed");
        res.status(400).send("Marking failed.");
      }
      else {
        res.status(200).send(response);
      }
    }
    else {
      console.error("SEARCH: car not inputted");
      res.status(400).send("Please input car.");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

router.get('/count-class', async (req, res) => {
  try{
    const pool = await req.pool;
    const request = await pool.request();
    
    let query = `BEGIN;
    declare @lA int, @lB int, @sA int, @sB int;
    SELECT @lA = COUNT(ID) FROM "User" WHERE hasLeft = 1 AND class = 'A';
    SELECT @lB = COUNT(ID) FROM "User" WHERE hasLeft = 1 AND class = 'B';
    SELECT @sA = COUNT(ID) FROM "User" WHERE hasLeft = 0 AND class = 'A';
    SELECT @sB = COUNT(ID) FROM "User" WHERE hasLeft = 0 AND class = 'B';
    SELECT @lA AS leftA, @lB AS leftB, @sA AS stayA, @sB AS stayB;
    END;`;
    let response = await request.query(query);
    if (response.recordset.length == 0) {
      console.error("COUNT: failed");
      res.status(400).send("Cannot count attendance");
    }
    else {
      let stayA = response.recordset[0].stayA;
      let stayB = response.recordset[0].stayB;
      let leftA = response.recordset[0].leftA;
      let leftB = response.recordset[0].leftB;
      res.status(200).send({stayA,stayB,leftA,leftB});
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

module.exports = router;
