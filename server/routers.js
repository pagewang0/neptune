const Router = require('koa-router');
const controllers = require('./controllers');
const md = require('./middleware');

const router = new Router();

router.post('/register', controllers.users.register);
router.post('/login', controllers.users.login);

router.get('/me', controllers.users.me);
router.get('/user', controllers.users.read);

router.post('/tag', md.auth(1), controllers.tags.create);
router.get('/tags', controllers.tags.list);

router.post('/post', controllers.posts.create);
router.get('/posts', controllers.posts.list);

router.post('/post_append', controllers.postAppends.create);
router.get('/post_appends', controllers.postAppends.list);

router.post('/reply', controllers.replies.create);
router.get('/replies', controllers.replies.list);

module.exports = router;
