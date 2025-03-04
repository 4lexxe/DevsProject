import { Request, Response } from 'express';
import ForumVoteReply, { VoteType } from '../models/ForumVoteReply';
import ForumReply from '../models/ForumReply';
import sequelize from '../../../infrastructure/database/db';
import { AuthRequest } from "../../auth/controllers/verify.controller";
import User from "../../user/User";

// Definimos una interfaz para los métodos del controlador
interface IForumVoteReplyController {
  getReplyVotes(req: Request, res: Response): Promise<void>;
  getUserReplyVote(req: AuthRequest, res: Response): Promise<void>;
  voteReply(req: AuthRequest, res: Response): Promise<void>;
  updateVoteReply(req: AuthRequest, res: Response): Promise<void>;
  deleteReplyVote(req: AuthRequest, res: Response): Promise<void>;
  getReplyVoteStats(req: Request, res: Response): Promise<void>;
}

export const ForumVoteReplyController: IForumVoteReplyController = {
  async getReplyVotes(req: Request, res: Response) {
    try {
      const { replyId } = req.params;
      const votes = await ForumVoteReply.findAll({
        where: { replyId },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username', 'avatar'] }],
      });
      res.status(200).json({ success: true, data: votes });
    } catch (error) {
      console.error('Error al obtener votos de la respuesta:', error);
      res.status(500).json({ success: false, message: 'Error al obtener votos de la respuesta' });
    }
  },

  async getUserReplyVote(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    try {
      const userId = req.user?.id;
      const { replyId } = req.params;
      const vote = await ForumVoteReply.findOne({ where: { replyId, userId } });
      if (!vote) {
        res.status(404).json({ success: false, message: 'Voto no encontrado' });
        return;
      }
      res.status(200).json({ success: true, data: vote });
    } catch (error) {
      console.error('Error al obtener voto del usuario:', error);
      res.status(500).json({ success: false, message: 'Error al obtener voto del usuario' });
    }
  },

  async voteReply(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user?.id;
      const { replyId, voteType } = req.body;

      if (!replyId || !userId || voteType === undefined) {
        res.status(400).json({ success: false, message: 'Se requieren replyId, userId y voteType' });
        return;
      }

      if (voteType !== VoteType.UPVOTE && voteType !== VoteType.DOWNVOTE) {
        res.status(400).json({ success: false, message: 'El tipo de voto debe ser 1 (upvote) o -1 (downvote)' });
        return;
      }

      const reply = await ForumReply.findByPk(replyId);
      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }

      const existingVote = await ForumVoteReply.findOne({ where: { replyId, userId } });

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          await existingVote.destroy({ transaction });
          await transaction.commit();
          res.status(200).json({ success: true, message: 'Voto eliminado exitosamente' });
          return;
        }

        await existingVote.update({ voteType }, { transaction });
        await transaction.commit();
        res.status(200).json({ success: true, message: 'Voto actualizado exitosamente' });
        return;
      }

      const newVote = await ForumVoteReply.create({ replyId, userId, voteType }, { transaction });
      await transaction.commit();
      res.status(201).json({ success: true, message: 'Voto registrado exitosamente', data: newVote });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al votar en la respuesta:', error);
      res.status(500).json({ success: false, message: 'Error al procesar el voto' });
    }
  },

  async updateVoteReply(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    try {
      const userId = req.user?.id;
      const { replyId, voteType } = req.body;

      if (voteType !== VoteType.UPVOTE && voteType !== VoteType.DOWNVOTE) {
        res.status(400).json({ error: 'Tipo de voto inválido. Debe ser 1 (upvote) o -1 (downvote).' });
        return;
      }

      const vote = await ForumVoteReply.findOne({ where: { replyId, userId } });

      if (!vote) {
        res.status(404).json({ error: 'Voto no encontrado.' });
        return;
      }

      await vote.update({ voteType });
      res.json({ message: 'Voto actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar el voto:', error);
      res.status(500).json({ error: 'Error al actualizar el voto.' });
    }
  },

  async deleteReplyVote(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user?.id;
      const { replyId } = req.params;

      const vote = await ForumVoteReply.findOne({ where: { replyId, userId } });

      if (!vote) {
        res.status(404).json({ success: false, message: 'Voto no encontrado' });
        return;
      }

      await vote.destroy({ transaction });
      await transaction.commit();
      res.status(200).json({ success: true, message: 'Voto eliminado exitosamente' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar voto de la respuesta:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar el voto' });
    }
  },

  async getReplyVoteStats(req: Request, res: Response) {
    try {
      const { replyId } = req.params;

      const reply = await ForumReply.findByPk(replyId);

      if (!reply) {
        res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          voteScore: reply.voteScore,
          upvoteCount: reply.upvoteCount,
          downvoteCount: reply.downvoteCount,
        },
      });
    } catch (error) {
      console.error('Error al obtener conteo de votos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener conteo de votos' });
    }
  },
};

export default ForumVoteReplyController;
