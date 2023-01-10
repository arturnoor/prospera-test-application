import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateIndustryChangeApplicationRequest } from '../dto/create-industry-change-application-request.dto';
import { IdInParamsDTO } from '../dto/id-in-params.dto';
import { IndustryChangeApplicationDetailsDTO } from '../dto/response.dto';
import { SearchIndustryChangeApplicationsDTO } from '../dto/search-industry-change-applications.dto';
import { SuccessDTO } from '../dto/success.dto';
import { ResidentRegisterService } from '../services/resident-register.service';

@ApiTags('Resident Register')
@Controller('resident-register')
export class ResidentRegisterController {
  constructor(
    private readonly residentRegisterService: ResidentRegisterService,
  ) {}

  @ApiOperation({ summary: 'Create industry change application.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IndustryChangeApplicationDetailsDTO,
  })
  @Post('industry-change-applications')
  async createIndustryChangeApplication(
    @Body() request: CreateIndustryChangeApplicationRequest,
  ) {
    return new IndustryChangeApplicationDetailsDTO(
      await this.residentRegisterService.createIndustryChangeApplication(
        request,
      ),
    );
  }

  @ApiOperation({ summary: 'Get industry change application by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IndustryChangeApplicationDetailsDTO,
  })
  @Get('industry-change-applications/:id')
  async getIndustryChangeApplicationById(@Param() params: IdInParamsDTO) {
    const { id } = params;
    return new IndustryChangeApplicationDetailsDTO(
      await this.residentRegisterService.getIndustryChangeApplicationById(id),
    );
  }

  @ApiOperation({ summary: 'Search for industry change applications.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IndustryChangeApplicationDetailsDTO,
    isArray: true,
  })
  @Get('industry-change-applications')
  async searchIndustryChangeApplications(
    @Query() query: SearchIndustryChangeApplicationsDTO,
  ): Promise<IndustryChangeApplicationDetailsDTO[]> {
    const icas =
      await this.residentRegisterService.searchIndustryChangeApplications(
        query,
      );
    return icas.map((ica) => new IndustryChangeApplicationDetailsDTO(ica));
  }

  @ApiOperation({ summary: 'Delete industry change application by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessDTO,
    isArray: true,
  })
  @Delete('industry-change-applications/:id')
  async deleteIndustryChangeApplication(
    @Param() params: IdInParamsDTO,
  ): Promise<SuccessDTO> {
    const { id } = params;
    await this.residentRegisterService.deleteIndustryChangeApplicationById(id);
    return { success: true };
  }
}
