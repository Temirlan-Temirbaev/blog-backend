import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@app/shared";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request.headers);

    if (!token) {
      throw new UnauthorizedException("You are not authorized");
    }

    try {
      const { id } = this.jwtService.verify(token);
      request.userId = id;
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  private extractTokenFromHeaders(headers: any): string | null {
    const authHeader = headers?.authorization;
    if (authHeader && authHeader.split(" ")[0] === "Bearer") {
      return authHeader.split(" ")[1];
    }
    return null;
  }
}
