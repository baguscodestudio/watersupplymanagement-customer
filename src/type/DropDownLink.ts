export default interface DropDownLinkType {
  name: string;
  icon: JSX.Element;
  sublinks: {
    path: string;
    name: string;
    icon: JSX.Element;
  }[];
}
