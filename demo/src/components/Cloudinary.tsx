import {yoot, type Yoot} from '@yoot/yoot';
import {getImgAttrs} from '@yoot/yoot/jsx';

export type Props = {
  nvc: string | Yoot;
};

export default function Cloudinary(props: Props) {
  const {nvc, ...rest} = props;

  return <img {...getImgAttrs(yoot(nvc))} {...rest} />;
}
