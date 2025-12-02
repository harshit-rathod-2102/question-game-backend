import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id.toString() };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        user: this.formatUser(user),
        accessToken,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const payload = { email: user.email, sub: user._id.toString() };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        user: this.formatUser(user),
        accessToken,
      },
    };
  }

  async getProfile(user: UserDocument) {
    return {
      success: true,
      data: this.formatUser(user),
    };
  }

  async logout(userId: string) {
    // In a real application, you might want to invalidate the token
    // by adding it to a blacklist in Redis or similar
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  private formatUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      profilePicture: user.profilePicture,
      birthdate: user.birthdate,
      phoneNumber: user.phoneNumber,
      role: user.role,
      permissions: user.permissions,
      isVerified: user.isVerified,
    };
  }
}

