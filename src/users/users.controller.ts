import { Controller, Get, Post, Body, Put, Request, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Put()
	@UseGuards(AuthGuard)
	update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
		const userId = req.user._id;
		return this.usersService.update(updateUserDto, userId);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOneById(id);
	}
}
