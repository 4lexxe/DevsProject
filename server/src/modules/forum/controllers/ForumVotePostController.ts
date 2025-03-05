import { Request, Response } from "express";
import ForumVote, { VoteType } from "../models/ForumVotePost";
import ForumPost from "../models/ForumPost";
import User from "../../user/User";
import sequelize from '../../../infrastructure/database/db';
import { AuthRequest } from "../../auth/controllers/verify.controller";

// Definimos una interfaz para los métodos del controlador
interface IForumVoteController {
  getVotesByPost(req: Request, res: Response): Promise<void>;
  getUserVoteForPost(req: AuthRequest, res: Response): Promise<void>;
  voteOnPost(req: AuthRequest, res: Response): Promise<void>;
  updateVotePost(req: AuthRequest, res: Response): Promise<void>;
  deleteVotePost(req: AuthRequest, res: Response): Promise<void>;
  getPostVoteStats(req: Request, res: Response): Promise<void>;
}

export const ForumVotePostController: IForumVoteController = {
  // Obtener todos los votos de un post específico
  async getVotesByPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const votes = await ForumVote.findAll({
        where: { postId },
        include: [{ model: User, as: "user", attributes: ["id", "name", "username", "avatar"] }],
      });
      res.json(votes);
    } catch (error) {
      console.error("Error al obtener los votos:", error);
      res.status(500).json({ error: "Error al obtener los votos del post." });
    }
  },

  // Obtener el voto de un usuario en un post específico
  async getUserVoteForPost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { postId } = req.params;
      
      const vote = await ForumVote.findOne({
        where: { userId, postId },
      });
      
      if (!vote) {
        res.status(404).json({ error: "No se encontró un voto para este post." });
        return;
      }
      
      res.json(vote);
    } catch (error) {
      console.error("Error al obtener el voto del usuario:", error);
      res.status(500).json({ error: "Error al obtener el voto del usuario para este post." });
    }
  },

  // Agregar un voto a un post
  async voteOnPost(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "No autorizado." });
      return;
    }
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user?.id;
      const { postId, voteType } = req.body;
      
      // Validar el tipo de voto
      if (voteType !== VoteType.UPVOTE && voteType !== VoteType.DOWNVOTE) {
        res.status(400).json({ error: "Tipo de voto inválido. Debe ser 1 (upvote) o -1 (downvote)." });
        return;
      }
      
      // Verificar si el post existe
      const post = await ForumPost.findByPk(postId, { transaction });
      if (!post) {
        res.status(404).json({ error: "Post no encontrado." });
        return;
      }
      
      // Verificar si ya existe un voto del usuario en este post
      const existingVote = await ForumVote.findOne({
        where: { userId, postId },
        transaction,
      });
      
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          res.status(200).json({ message: "El voto ya está registrado con este valor." });
          return;
        }
        
        // Si el voto existe pero con diferente valor, actualizarlo
        await existingVote.update({ voteType }, { transaction });
        await transaction.commit();
        res.json({ message: "Voto actualizado correctamente." });
        return;
      }
      
      // Crear un nuevo voto
      await ForumVote.create({ userId, postId, voteType }, { transaction });
      await transaction.commit();
      res.status(201).json({ message: "Voto agregado correctamente." });
    } catch (error) {
      await transaction.rollback();
      console.error("Error al votar:", error);
      res.status(500).json({ error: "Error al registrar el voto." });
    }
  },

  // Actualizar un voto existente
  async updateVotePost(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "No autorizado." });
      return;
    }
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user?.id;
      const { postId, voteType } = req.body;
      
      // Validar el tipo de voto
      if (voteType !== VoteType.UPVOTE && voteType !== VoteType.DOWNVOTE) {
        res.status(400).json({ error: "Tipo de voto inválido. Debe ser 1 (upvote) o -1 (downvote)." });
        return;
      }
      
      const vote = await ForumVote.findOne({
        where: { userId, postId },
        transaction,
      });
      
      if (!vote) {
        res.status(404).json({ error: "Voto no encontrado." });
        return;
      }
      
      await vote.update({ voteType }, { transaction });
      await transaction.commit();
      res.json({ message: "Voto actualizado correctamente." });
    } catch (error) {
      await transaction.rollback();
      console.error("Error al actualizar el voto:", error);
      res.status(500).json({ error: "Error al actualizar el voto." });
    }
  },

  // Eliminar un voto
  async deleteVotePost(req: AuthRequest, res: Response) {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "No autorizado." });
      return;
    }
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user?.id;
      const { postId } = req.params;
      
      const vote = await ForumVote.findOne({
        where: { userId, postId },
        transaction,
      });
      
      if (!vote) {
        res.status(404).json({ error: "Voto no encontrado." });
        return;
      }
      
      await vote.destroy({ transaction });
      await transaction.commit();
      res.json({ message: "Voto eliminado correctamente." });
    } catch (error) {
      await transaction.rollback();
      console.error("Error al eliminar el voto:", error);
      res.status(500).json({ error: "Error al eliminar el voto." });
    }
  },

  // Obtener estadísticas de votos de un post
  async getPostVoteStats(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      
      const post = await ForumPost.findByPk(postId, {
        attributes: ["id", "voteScore", "upvoteCount", "downvoteCount"],
      });
      
      if (!post) {
        res.status(404).json({ error: "Post no encontrado." });
        return;
      }
      
      res.json({
        postId,
        voteScore: post.voteScore,
        upvoteCount: post.upvoteCount,
        downvoteCount: post.downvoteCount
      });
    } catch (error) {
      console.error("Error al obtener estadísticas de votos:", error);
      res.status(500).json({ error: "Error al obtener las estadísticas de votos del post." });
    }
  },

};

export default ForumVotePostController;