import { Seeder } from 'mongoose-data-seed';
import Organization from '../models/organization.model';
import organizationData from './organizations.json';

class OrganizationSeeder extends Seeder {
  async shouldRun() {
    return Organization.countDocuments()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return Organization.create(organizationData);
  }
}

export default OrganizationSeeder;
