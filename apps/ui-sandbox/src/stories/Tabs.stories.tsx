"use client";
import { Section, Story } from "~/components";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsRoot,
} from "@valence-ui/ui-components";

const Tabs = () => {
  return (
    <Section id="tabs">
      <Story>
        <TabsRoot defaultValue={TabOptions.Tab1}>
          <TabsList className="">
            <TabsTrigger value={TabOptions.Tab1}>Primary Tab 1</TabsTrigger>
            <TabsTrigger value={TabOptions.Tab2}> Tab 2</TabsTrigger>
            <TabsTrigger value={TabOptions.Tab3}> Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value={TabOptions.Tab1}>Tab 1 Content</TabsContent>
          <TabsContent value={TabOptions.Tab2}>Tab 2 Content</TabsContent>
          <TabsContent value={TabOptions.Tab3}>Tab 3 Content</TabsContent>
        </TabsRoot>
      </Story>
      <Story className="mt-8">
        <TabsRoot defaultValue={TabOptions.Tab1}>
          <TabsList className="">
            <TabsTrigger value={TabOptions.Tab1}>Secondary Tab 1</TabsTrigger>
            <TabsTrigger value={TabOptions.Tab2}> Tab 2</TabsTrigger>
            <TabsTrigger value={TabOptions.Tab3}> Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent variant="secondary" value={TabOptions.Tab1}>
            Tab 1 Content
          </TabsContent>
          <TabsContent variant="secondary" value={TabOptions.Tab2}>
            Tab 2 Content
          </TabsContent>
          <TabsContent variant="secondary" value={TabOptions.Tab3}>
            Tab 3 Content
          </TabsContent>
        </TabsRoot>
        <p>
          Note: this variant is not used in the app, actually only used in UI
          sandbox
        </p>
      </Story>
    </Section>
  );
};

enum TabOptions {
  Tab1 = "tab1",
  Tab2 = "tab2",
  Tab3 = "tab",
}

export default Tabs;
