import { Controller, Get, Patch, Put, Body, Request, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// Update user data
	@Put()
	@UseGuards(AuthGuard)
	update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
		const userId = req.user._id;
		return this.usersService.update(updateUserDto, userId);
	}

	// Update or delete instruments
	@Patch()
	@UseGuards(AuthGuard)
	async updateInstruments(@Body() body: any, @Request() req) {
		const userId = req.user._id;
		return this.usersService.updateInstruments(userId, body);
	}

	// Get all users
	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	// Get a single user by ID
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOneById(id);
	}
}
