"use client";

interface LoadingScreenProps {
  children: React.ReactNode;
}

export function LoadingScreen({ children }: LoadingScreenProps) {
  // const siteConfig = useSiteConfig();

  // if (isLoading) {
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
  //       {/* Background effects */}
  //       <div className="absolute inset-0">
  //         {/* Animated gradient mesh */}
  //         <div className="via-muted/5 absolute inset-0 bg-gradient-to-br from-background to-background" />

  //         {/* Floating orbs */}
  //         <div className="bg-primary/3 absolute left-1/4 top-1/4 h-72 w-72 animate-pulse-subtle rounded-full blur-3xl" />
  //         <div
  //           className="bg-accent/2 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse-subtle rounded-full blur-3xl"
  //           style={{ animationDelay: "1s" }}
  //         />

  //         {/* Subtle grid pattern */}
  //         <div
  //           className="absolute inset-0 opacity-[0.02]"
  //           style={{
  //             backgroundImage: `
  //               linear-gradient(var(--border) 1px, transparent 1px),
  //               linear-gradient(90deg, var(--border) 1px, transparent 1px)
  //             `,
  //             backgroundSize: "40px 40px",
  //           }}
  //         />
  //       </div>

  //       {/* Loading Content */}
  //       <div className="relative z-10 space-y-8 text-center">
  //         {/* Logo */}
  //         <div className="flex justify-center">
  //           <div className="relative">
  //             <div className="via-primary/90 shadow-primary/20 flex h-16 w-16 animate-pulse items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent-foreground shadow-2xl">
  //               <span className="text-xl font-black tracking-tight text-primary-foreground">
  //                 {siteConfig.personal.initials}
  //               </span>
  //             </div>
  //             {/* Status indicator */}
  //             <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg">
  //               <div className="h-2 w-2 animate-ping rounded-full bg-white" />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Loading Text */}
  //         <div className="space-y-4">
  //           <h1 className="text-2xl font-bold text-foreground md:text-3xl">
  //             {siteConfig.personal.name}
  //           </h1>
  //           <p className="animate-pulse text-muted-foreground">
  //             Loading amazing experiences...
  //           </p>
  //         </div>

  //         {/* Loading Animation */}
  //         <div className="flex justify-center space-x-2">
  //           <div
  //             className="h-3 w-3 animate-bounce rounded-full bg-primary"
  //             style={{ animationDelay: "0s" }}
  //           />
  //           <div
  //             className="h-3 w-3 animate-bounce rounded-full bg-primary"
  //             style={{ animationDelay: "0.1s" }}
  //           />
  //           <div
  //             className="h-3 w-3 animate-bounce rounded-full bg-primary"
  //             style={{ animationDelay: "0.2s" }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return <div className="animate-fadeIn">{children}</div>;
}
