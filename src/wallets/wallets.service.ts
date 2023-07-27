import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class WalletsService {
	constructor(private prismaService: PrismaService) {}

	create(input: { id: string }) {
		return this.prismaService.wallet.create({
			data: {
				id: input.id,
			},
		});
	}

	all() {
		return this.prismaService.wallet.findMany();
	}
}
