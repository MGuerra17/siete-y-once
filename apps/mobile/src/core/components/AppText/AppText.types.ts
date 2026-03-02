export type AppTextVariant = "title" | "subtitle" | "body" | "label";

export type AppTextProps = {
  children: React.ReactNode;
  variant?: AppTextVariant;
  align?: "left" | "center" | "right";
};

