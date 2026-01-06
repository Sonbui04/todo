import { Router } from 'express';
import * as authController from './controllers/authController';
import * as todoController from './controllers/todoController';
import { authenticateToken } from './middleware/authMiddleware';

const router = Router();

// AUTH
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// TODOS (protected)
router.post('/todos', authenticateToken, todoController.createTodo);
router.get('/todos', authenticateToken, todoController.getTodos);
router.get('/todos/:id', authenticateToken, todoController.getTodoById);
router.put('/todos/:id', authenticateToken, todoController.updateTodo);
router.delete('/todos/:id', authenticateToken, todoController.deleteTodo);

export default router;
