import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const createTodoSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
});

const updateTodoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
});

export const createTodo = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description } = createTodoSchema.parse(req.body);
        const userId = req.user!.id;

        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                userId,
            },
        });

        res.status(201).json(todo);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { search, completed, sort, page = '1', limit = '10' } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = { userId };

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        if (completed !== undefined) {
            where.completed = completed === 'true';
        }

        const orderBy: any = {};
        if (sort === 'oldest') {
            orderBy.createdAt = 'asc';
        } else {
            orderBy.createdAt = 'desc'; // default 'newest'
        }

        const [todos, total] = await prisma.$transaction([
            prisma.todo.findMany({
                where,
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma.todo.count({ where }),
        ]);

        res.json({
            data: todos,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTodoById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const todo = await prisma.todo.findFirst({
            where: { id, userId },
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const data = updateTodoSchema.parse(req.body);

        // Verify ownership
        const existingTodo = await prisma.todo.findFirst({ where: { id, userId } });
        if (!existingTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        const todo = await prisma.todo.update({
            where: { id },
            data,
        });

        res.json(todo);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Verify ownership
        const existingTodo = await prisma.todo.findFirst({ where: { id, userId } });
        if (!existingTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await prisma.todo.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
