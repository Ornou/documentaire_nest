import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from './entities/document.entity';
import * as fs from 'fs';
import * as path from 'path';
import { createWriteStream } from 'fs';
// Utilisation de require pour éviter les problèmes de typage avec graphql-upload
const { GraphQLUpload } = require('graphql-upload');
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

// Définition du type FileUpload
interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @CurrentUser() user: any,
  ) {
    return this.documentService.create(createDocumentInput, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async uploadDocument(
    @Args('title') title: string,
    @Args('description', { nullable: true }) description: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: Promise<FileUpload> | null,
    @CurrentUser() user: any,
  ) {
    let fileUrl = '';
    // Utiliser __dirname pour obtenir le chemin du répertoire actuel
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');

    try {
      // Créer le dossier uploads s'il n'existe pas
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Dossier uploads créé à: ${uploadDir}`);
      }

      if (file) {
        try {
          const { createReadStream, filename, mimetype, encoding } = await file;

          // Vérifier si le fichier est présent
          if (!filename || !createReadStream) {
            throw new Error('Fichier invalide');
          }

          // Vérifier le type MIME du fichier
          const allowedMimeTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', // Excel (xls)
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (xlsx)
            'text/csv', // CSV
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/bmp',
            'image/svg+xml',
          ];
          if (!allowedMimeTypes.includes(mimetype)) {
            throw new Error('Type de fichier non pris en charge');
          }

          // Générer un nom de fichier unique
          const fileExt = path.extname(filename);
          const baseName = path.basename(filename, fileExt);
          const newFilename = `${Date.now()}-${baseName}${fileExt}`;
          const filePath = path.join(uploadDir, newFilename);

          console.log(`Tentative d'upload du fichier vers: ${filePath}`);

          await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(filePath);
            const readStream = createReadStream();

            writeStream
              .on('finish', () => {
                console.log(`Fichier sauvegardé avec succès: ${filePath}`);
                resolve(true);
              })
              .on('error', (error) => {
                console.error("Erreur lors de l'écriture du fichier:", error);
                reject(error);
              });

            readStream.pipe(writeStream);
          });

          fileUrl = `/uploads/${newFilename}`;
        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', error);
          throw new Error(
            `Erreur lors du traitement du fichier: ${error.message}`,
          );
        }
      } else {
        try {
          // Si aucun fichier n'est fourni, créer un fichier texte avec le titre et la description
          const content = `Titre: ${title}\n\n${description || 'Aucune description fournie'}`;
          const newFilename = `document-${Date.now()}-${Math.round(Math.random() * 1e9)}.txt`;
          const filePath = path.join(uploadDir, newFilename);

          console.log('Création du fichier texte:', filePath);

          // Utiliser fs.writeFileSync pour s'assurer que le fichier est écrit immédiatement
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log('Fichier texte créé avec succès');

          // Vérifier que le fichier a bien été créé
          if (fs.existsSync(filePath)) {
            console.log('Le fichier a bien été créé à:', filePath);
            fileUrl = `/uploads/${newFilename}`;
          } else {
            console.error("Erreur: Le fichier n'a pas pu être créé");
            throw new Error('Erreur lors de la création du fichier');
          }
        } catch (error) {
          console.error("Erreur lors de l'écriture du fichier texte:", error);
          throw new Error(
            `Erreur lors de la création du fichier: ${error.message}`,
          );
        }
      }

      // Créer le document avec le chemin du fichier
      const createDocumentInput: CreateDocumentInput = {
        title,
        description: description || undefined,
        fileUrl: fileUrl || undefined,
      };

      return this.documentService.create(createDocumentInput, user.sub);
    } catch (error) {
      console.error("Erreur lors de l'upload du document:", error);
      throw new Error(`Erreur lors de l'upload du document: ${error.message}`);
    }
  }

  @Query(() => [Document])
  @UseGuards(JwtAuthGuard)
  async findAllDocuments() {
    return this.documentService.findAll();
  }

  @Query(() => Document)
  @UseGuards(JwtAuthGuard)
  async findOneDocument(@Args('id', { type: () => Int }) id: number) {
    return this.documentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async updateDocumentWithFile(
    @Args('id', { type: () => Int }) id: number,
    @Args('title') title: string,
    @Args('description', { nullable: true }) description: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: Promise<FileUpload> | null,
    @CurrentUser() user: any,
  ) {
    let fileUrl = '';
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');

    try {
      // Créer le dossier uploads s'il n'existe pas
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Dossier uploads créé à: ${uploadDir}`);
      }

      // Récupérer le document actuel pour vérifier s'il y a un ancien fichier à supprimer
      const currentDocument = await this.documentService.findOne(id);
      
      if (file) {
        try {
          const { createReadStream, filename, mimetype } = await file;

          // Vérifier si le fichier est présent
          if (!filename || !createReadStream) {
            throw new Error('Fichier invalide');
          }

          // Vérifier le type MIME du fichier
          const allowedMimeTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/bmp',
            'image/svg+xml',
          ];
          
          if (!allowedMimeTypes.includes(mimetype)) {
            throw new Error('Type de fichier non pris en charge');
          }

          // Supprimer l'ancien fichier s'il existe
          if (currentDocument.fileUrl) {
            const oldFilePath = path.join(uploadDir, path.basename(currentDocument.fileUrl));
            if (fs.existsSync(oldFilePath)) {
              try {
                fs.unlinkSync(oldFilePath);
                console.log(`Ancien fichier supprimé: ${oldFilePath}`);
              } catch (error) {
                console.error("Erreur lors de la suppression de l'ancien fichier:", error);
              }
            }
          }

          // Générer un nom de fichier unique
          const fileExt = path.extname(filename);
          const baseName = path.basename(filename, fileExt);
          const newFilename = `${Date.now()}-${baseName}${fileExt}`;
          const filePath = path.join(uploadDir, newFilename);

          console.log(`Tentative d'upload du nouveau fichier vers: ${filePath}`);

          await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(filePath);
            const readStream = createReadStream();

            writeStream
              .on('finish', () => {
                console.log(`Fichier sauvegardé avec succès: ${filePath}`);
                resolve(true);
              })
              .on('error', (error) => {
                console.error("Erreur lors de l'écriture du fichier:", error);
                reject(error);
              });

            readStream.pipe(writeStream);
          });

          fileUrl = `/uploads/${newFilename}`;
        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', error);
          throw new Error(
            `Erreur lors du traitement du fichier: ${error.message}`,
          );
        }
      } else if (file === null) {
        // Si file est explicitement null, cela signifie qu'on veut supprimer le fichier existant
        if (currentDocument.fileUrl) {
          const oldFilePath = path.join(uploadDir, path.basename(currentDocument.fileUrl));
          if (fs.existsSync(oldFilePath)) {
            try {
              fs.unlinkSync(oldFilePath);
              console.log(`Fichier supprimé: ${oldFilePath}`);
            } catch (error) {
              console.error("Erreur lors de la suppression du fichier:", error);
              throw new Error("Erreur lors de la suppression du fichier existant");
            }
          }
        }
      }

      // Mettre à jour le document avec les nouvelles informations
      const updateData: UpdateDocumentInput = {
        id, // Ajout de l'ID manquant
        title,
        description: description || undefined,
        fileUrl: file !== undefined 
          ? (file ? fileUrl : undefined) 
          : currentDocument.fileUrl || undefined, // S'assure que c'est undefined et non null
      };

      return this.documentService.update(id, updateData, user.sub);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du document:", error);
      throw new Error(`Erreur lors de la mise à jour du document: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async updateDocument(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
    @CurrentUser() user: any,
  ) {
    return this.documentService.update(id, updateDocumentInput, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async removeDocument(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.documentService.remove(id, user.sub);
  }
}
