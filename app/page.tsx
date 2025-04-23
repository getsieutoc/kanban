import { Feature1, FeatureLeft, FeatureRight } from './sections/features';
import { GeneralFooter } from './sections/footer';
import { Header } from './sections/header';
import { Hero } from './sections/hero';
import { Cta1 } from './sections/ctas';

export default function Home() {
  return (
    <div id="root" className="leading-tight text-pretty">
      <Header />

      <Hero />

      <Feature1 />

      <FeatureRight
        title="Fair Revenue Sharing"
        content="After covering infrastructure costs, all income is split proportionally among contributors: artists, developers, and supporters"
      />

      <FeatureLeft
        title="Early Bird Incentive"
        content="Join now for lifetime discounts and a permanent stake in our profit-sharing pool."
      />

      <Cta1 />

      <GeneralFooter />
    </div>
  );
}
