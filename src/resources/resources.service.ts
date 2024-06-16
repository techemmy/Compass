import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resources, ResourcesDocument } from './schemas/resources.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { ResourceType } from './enums/resources.enums';

@Injectable()
export class ResourcesService {
  private IMAGES_FOLDER = 'rsharing';

  constructor(
    @InjectModel(Resources.name) private resourceModel: Model<Resources>,
    private cloudinaryService: CloudinaryService,
  ) {}

  create(createResourceDto: CreateResourceDto): Promise<ResourcesDocument> {
    return this.resourceModel.create(createResourceDto);
  }

  findAll({ limit, offset }: Pagination) {
    return this.resourceModel.find({}).limit(limit).skip(offset);
  }

  countAll() {
    return this.resourceModel.countDocuments();
  }

  findOne(id: string) {
    return this.resourceModel.findById(id);
  }

  update(id: string, updateResourceDto: UpdateResourceDto) {
    return this.resourceModel.findByIdAndUpdate(id, updateResourceDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.resourceModel.findByIdAndDelete(id);
  }

  async uploadResourceImage({
    file,
    resource,
    pageNo,
  }: {
    file: Express.Multer.File;
    resource: ResourcesDocument;
    pageNo: number;
  }) {
    const folder = `${this.IMAGES_FOLDER}/${resource.resource_type}`;
    return await this.cloudinaryService
      .uploadImage({ file, folder, public_id: `${resource.id}-${pageNo}` })
      .catch((e) => {
        throw new BadRequestException('Invalid file type. Image upload failed');
      });
  }

  async deleteResourceImage({
    resource,
    pageNo,
  }: {
    resource: ResourcesDocument;
    pageNo: number;
  }) {
    const deleted = await this.cloudinaryService.deleteImage({
      folder: this.IMAGES_FOLDER,
      public_id: `${resource.resource_type}/${resource.id}-${pageNo}`,
    });

    if (deleted.result === 'not found') {
      throw new NotFoundException('Image not found');
    }
    return;
  }

  async deleteResourceImages(resource: ResourcesDocument): Promise<void> {
    for (const image of resource.images) {
      await this.cloudinaryService.deleteImage({
        folder: this.IMAGES_FOLDER,
        public_id: `${resource.resource_type}/${resource.id}-${image.pageNo}`,
      });
    }
    return;
  }
}