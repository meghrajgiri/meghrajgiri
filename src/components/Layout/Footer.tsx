import { Paragraph } from "../typography";

const FooterColumn = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className="space-y-7">
      <Paragraph
        text={title}
        weight="semibold"
        variant="para-18"
        className="text-primary"
      />
      <div className="space-y-4">
        {items.map((item) => (
          <Paragraph key={item} text={item} className="text-secondary" />
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="p-24">
      <section className="dark:border-border border-border mx-auto flex max-w-[1120px] flex-row space-x-10 rounded-[40px] border bg-white-100 p-16">
        <div className="w-1/2 space-y-5">
          <div className="text rounded-full text-2xl font-bold text-primary">
            Meghraj. hjghjg
          </div>
          <Paragraph
            text="Meghraj is a versatile designer & developer based in the Indonesia, dedicated to crafting innovative and visually appealing digital experiences."
            className="text-secondary"
          />
        </div>
        <div className="flex w-1/2 flex-row justify-between space-x-12">
          <FooterColumn title="Pages" items={["About", "Contact", "Careers"]} />
          <FooterColumn
            title="Resources"
            items={["About", "Contact", "Careers"]}
          />
          <FooterColumn
            title="Utility Pages"
            items={["About", "Contact", "Careers"]}
          />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
