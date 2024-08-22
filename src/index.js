const app = require('./app');

app.listen(app.get('port'), () => {
    console.log("🚀 serviodor 👂", app.get('port'));
})