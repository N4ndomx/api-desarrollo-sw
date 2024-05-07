import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export function handleDBexceptions(error: any, logger: Logger) {
    // console.log(error.code)
    if (error.code === '23505') {
        throw new BadRequestException(error.detail);
    }
    logger.error(error);
    throw new InternalServerErrorException('Error revisar consola ');
}