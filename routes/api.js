/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try{
        const books = await Book.find({});
        if(!books){
          res.json([]);
          return;
        }
        const formatData = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length
          };
        });
        res.json(formatData);
        return;
      }catch (err) {
        res.json([]);
      }
    
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if(!title) {
        res.send("missing required field tittle");
        return;
      }
      const newBook = new Book({title, comments: []});
      try{
        const book = await newBook.save();
        res.json({_id: book.id, title: book.title});
      } catch (err){
        res.send("there was an error saving");
      }
    })
    
    .delete(async function (req, res){
      //if successful response will be 'complete delete successful'
      try{
        const deleted = await Book.deleteMany();
        console.log("deleted :>>", deleted);
        res.send("complete delete successful");
      } catch (err){
        res.send("error");
      }
    });



  app.route('/api/books/:id')
    .get(async  (req, res) => {
      let bookID = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookID);
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        })
      } catch (err) {
        res.send("no book exists");
      }
    })
    
    .post(async  (req, res) => {
      let bookID = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send(`missing required field comment`);
        return;
      }
      //json res format same as .get

      try {
        let book = await Book.findById(bookID);
        book.comments.push(comment);
        book = await book.save();
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        });
        
      } catch (err) {
        res.send("no book exists");
      }
      

    })

    .delete(async (req, res) => {
      let bookID = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const deleted = await Book.findByIdAndDelete(bookID);
        console.log("deleted :>> " , deleted);
        if(!deleted) throw new Error("no book exists");
        res.send("delete successful");
      } catch (err) {
        res.send("no book exists")
      }

    });
};
