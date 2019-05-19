const express = require('express');
const router = express.Router();

// @route   api/post 
// @access  Public
router.get('/',(req,res)=>{
    res.send("Post page");
});

module.exports= router;