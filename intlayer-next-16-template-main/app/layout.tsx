import type { FC, PropsWithChildren } from "react";
import "./styles/globals.css";

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
	<>{children}</>
);

export default RootLayout;
