
const pool = require("../../config/database");
//query
module.exports = {
    getData:function(c_id,cb){
        const q = `select * from where cart_tbl=?`
        pool.query(q,[c_id],(err,result)=>{
            if(err){
                cb(err)
            }
            cb(null,result)
        })
    },
    insert:function(data,cb){
        const q = `INSERT INTO  cart_tbl (p_id ,  c_id ) VALUES (?,?)`;
        pool.query(q,[data.p_id,data.c_id],(err,result)=>{
            if(err){
                cb(err)
            }
            cb(null,result)
        })
    }
}