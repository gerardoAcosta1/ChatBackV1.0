import userRoutes from '../modules/users/users.routes.js'
import conversationRoutes from '../modules/conversations/conversations.routes.js'
import messageRoutes from '../modules/messages/messages.routes.js'
const apiV1Routes = app => {

    app.use('/users', userRoutes);
    app.use('/conversations', conversationRoutes);
    app.use('/messages', messageRoutes)
}

export default apiV1Routes/*


*/