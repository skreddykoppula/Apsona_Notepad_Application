const { Router } = require('express')
const authController = require('../controller/authController')
const noteController = require('../controller/noteController')
const {requireAuth} = require('../middleware/authmiddleware')


const router = Router()


router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout', authController.logout_get);
router.post('/notes',requireAuth,noteController.notes_create);
router.get('/notes',requireAuth,noteController.get_notes);
router.put('/notes/addLabel/:id',requireAuth,noteController.add_label)
router.put('/notes/delete/:id',requireAuth,noteController.delete)
router.put('/notes/archieve/:id',requireAuth,noteController.archieve)
router.put('/notes/deleterestore/:id',requireAuth,noteController.deleterestore)
router.put('/notes/archieverestore/:id',requireAuth,noteController.archieverestore)
router.get('/notes/search', requireAuth, noteController.search);


module.exports = router;


