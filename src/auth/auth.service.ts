import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
        console.log(user); // TO DO here, maybe pass username and password instead of user https://docs.nestjs.com/security/authentication
        
        const validatedUser = await this.validateUser(user.email, user.password);
        const payload = { email: validatedUser.email, name: validatedUser.name };
        return { access_token: this.jwtService.sign(payload) };
      }

    async register(user: CreateUserDto): Promise<any> {
        try {
            const existingUser = await this.usersService.findOneByEmail(user.email);
            if (existingUser) {
            throw new BadRequestException('email already exists');
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser: User = { ...user, password: hashedPassword };
            await this.usersService.create(newUser);
            return this.login(newUser);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            //throw new InternalServerErrorException('An error occurred during registration');
        }    
    }

}
