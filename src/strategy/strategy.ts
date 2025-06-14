import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not set in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: number; email: string; role: any }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        role: payload.role,
      },
    });

    if (!payload.role) {
      throw new UnauthorizedException('Role missing');
    }
    // delete user?.hash;
    console.log(payload);
    return user;
  }
}
