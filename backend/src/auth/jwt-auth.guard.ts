import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // ✅ Rendre compatible GraphQL :
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      console.log('Token manquant');
      return false; 
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY || 'secret',
      });
      console.log('Token validé:', decoded);
      request.user = decoded; // ✅ Injection dans req.user pour le décorateur
      return true;
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      return false; 
    }
  }
}
