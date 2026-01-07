import { CreateKelompokDto } from '../../kelompok/dto/create-kelompok.dto';
import { CreateWilayahDto } from '../../wilayah/dto/create-wilayah.dto';
import { CreateJemaatDto } from './create-jemaat.dto';
export declare class CreateJemaatWithRelationsDto extends CreateJemaatDto {
    wilayah?: CreateWilayahDto;
    kelompok?: CreateKelompokDto;
}
