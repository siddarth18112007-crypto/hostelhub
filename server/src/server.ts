import app from './app';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`HostelHub API Server listening on port ${PORT}`);
  console.log(`Running in PRODUCTION-READY Express+TypeScript mode`);
  console.log(`==================================================`);
});
