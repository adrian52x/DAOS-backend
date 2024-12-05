import { Controller, Get, Post, Body, UseGuards, Request, Put, Param } from '@nestjs/common';
import { EnsemblesService } from './ensembles.service';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { HandleRequestDto } from './dto/handle-request.dto';
import { UpdateEnsembleDto } from './dto/update-ensemble.dto';

@Controller('/api/ensembles')
export class EnsemblesController {
	constructor(private readonly ensemblesService: EnsemblesService) {}

	@Post()
	@UseGuards(AuthGuard)
	async create(@Body() createEnsembleDto: CreateEnsembleDto, @Request() req) {
		const ownerId = req.user._id; // authenticated user's id
		return this.ensemblesService.create({ ...createEnsembleDto, owner: ownerId, members: [ownerId] });
	}

	@Put('/join/:ensembleId')
	@UseGuards(AuthGuard)
	async requestToJoin(@Param('ensembleId') ensembleId: string, @Request() req) {
		const userId = req.user._id;
		return this.ensemblesService.requestToJoin(ensembleId, userId);
	}

	@Put('/:ensembleId/handle-request/:handleUserId/')
	@UseGuards(AuthGuard)
	async handleJoinRequest(@Param('ensembleId') ensembleId: string, @Param('handleUserId') handleUserId: string, @Body() actionDto: HandleRequestDto, @Request() req) {
		const userId = req.user._id;
		return this.ensemblesService.handleJoinRequest(ensembleId, handleUserId, actionDto, userId);
	}

	@Get()
	async findAll() {
		return this.ensemblesService.findAll();
	}

	@Get('/one/:id')
	findOne(@Param('id') id: string) {
		return this.ensemblesService.findOneById(id);
	}

	@Get('/own')
	@UseGuards(AuthGuard)
	async findAllUserOwn(@Request() req) {
		const userId = req.user._id;
		return this.ensemblesService.findAllUserOwn(userId);
	}

	@Get('/member/:id')
	async findEnsemblesByUser(@Param('id') id: string) {
		return this.ensemblesService.findEnsemblesByUser(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	async update(@Param('id') id: string, @Body() updateEnsembleDto: UpdateEnsembleDto, @Request() req) {
		const userId = req.user._id;
		return this.ensemblesService.update(id, updateEnsembleDto, userId);
	}
}
