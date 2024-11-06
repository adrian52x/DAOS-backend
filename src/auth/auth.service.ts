import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';

// interface AccessToken {
//     access_token: string;
// }



@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}
    
    async validateUser(email: string, password: string): Promise<User> {
        const user: User = await this.usersService.findOneByEmail(email);
        if (!user) {
          throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
          throw new BadRequestException('Password does not match');
        }
        return user;
    }

    async login(user: User): Promise<any> {
        const payload = { email: user.email, name: user.name };
        return { access_token: this.jwtService.sign(payload) };
    }

    async register(user: CreateUserDto): Promise<any> {
        const existingUser = await this.usersService.findOneByEmail(user.email);
        if (existingUser) {
          throw new BadRequestException('email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: User = { ...user, password: hashedPassword };
        await this.usersService.create(newUser);
        return this.login(newUser);
    }

}
