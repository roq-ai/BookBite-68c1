import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { usersValidationSchema } from 'validationSchema/users';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getUsersById();
    case 'PUT':
      return updateUsersById();
    case 'DELETE':
      return deleteUsersById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUsersById() {
    const data = await prisma.users.findFirst({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }

  async function updateUsersById() {
    await usersValidationSchema.validate(req.body);
    const data = await prisma.users.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteUsersById() {
    const data = await prisma.users.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
