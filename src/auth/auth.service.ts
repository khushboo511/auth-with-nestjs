import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { SigninDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './roles';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    // 1. Hash the password
    const hash = await argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          hash,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          role: dto.role,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });
      const tokens = await this.jwtToken(user.id, user.email, user.role);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const pwdMatch = await argon2.verify(user.hash, dto.password);
    if (!pwdMatch) throw new ForbiddenException('Credentials incorrect');

    // return this.jwtToken(user.id, user.email);
    const tokens = await this.jwtToken(user.id, user.email, user.role);
    console.log(user.id, user.role, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    if (user.role !== Role.User) {
      throw new ForbiddenException('Access denied');
    }

    return tokens;
  }

  async signout(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: null,
      },
    });
    return { message: 'Logged out successfully' };
  }

  async jwtToken(
    userId: number,
    email: string,
    role: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: userId, email, role };
    const secret = this.config.get<string>('JWT_SECRET');

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return { access_token, refresh_token };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon2.hash(rt);
    console.log(hash);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
