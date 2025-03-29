"use client";
import React, { use } from "react";
import { getSingle } from "../../apiServices/apiServices";
import {
  Banner,
  Wrapper,
  Flex,
  FlexWrap,
  Card,
  Badge,
  Heading,
  List,
  ListItem,
  Label,
  Paragraph,
  Button,
} from "mfg-ui-components";
import { FaAngleLeft } from "react-icons/fa6";

const promiseCache = new Map<string, Promise<unknown>>();
function useQuery<T>({ fn, key }: { fn: () => Promise<T>; key: string }) {
  if (!promiseCache.has(key)) {
    promiseCache.set(key, fn());
  }
  const promisres = promiseCache.get(key) as Promise<T>;
  const result = use(promisres);
  return result;
}
const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const singleData = useQuery({
    key: `single-data-${id}`,
    fn: () => getSingle(id),
  });
  const handleBackButton = () => {
    window.history.back();
  };
  return (
    <>
      <Banner
        bannerImage={singleData.image}
        bannerOverlay="darkOverlay"
        alterText={singleData.name}
        bannerSize="oneTherd"
      >
        <h1>{singleData.name}</h1>
      </Banner>
      <Wrapper wrapClass="fixWrap">
        <FlexWrap>
          <Flex FlexWidth="full-col">
            <Button customClass={'marginBottom'} ButtonClass="mfg-danger" onClick={handleBackButton}><FaAngleLeft/>Back</Button>
            <Card
              CardView="mfg-list"
              CardImagePath={singleData.image}
              CardImageAlt={singleData.name}
              cardBodyChildren={
                <>
                  <Paragraph><strong>Calories Per Serving :</strong> { singleData.caloriesPerServing}</Paragraph>
                  <Paragraph><strong>Cook Time:</strong> { singleData.cookTimeMinutes} Min</Paragraph>
                  <Paragraph><strong>Prepare Time:</strong> { singleData.prepTimeMinutes} Min</Paragraph>
                  <Paragraph><strong>Difficulty:</strong> { singleData.difficulty}</Paragraph>
                  <Paragraph><strong>Serve to :</strong> { singleData.servings} people</Paragraph> 
                  <Paragraph><strong>Cusine Type :</strong> {singleData.cusine} people</Paragraph>
                  <div><strong>Tags :</strong> <Badge badgeData={singleData?.tags.map((i)=>i)} type="mfg-primary" size="mfg-small"/></div>
                  <Heading Type="h4">Ingrediant</Heading>
                  <List Type="ol" ListStyleType="circle">
                  {
                    singleData.ingredients.map((ingredient) => (
                      <ListItem key={ingredient}>{ingredient}</ListItem>
                    ))
                  }
                  </List>
                  <Heading Type="h4">Instructions</Heading>
                  <List Type="ol" ListStyleType="square">
                  {
                    singleData.instructions.map((instr) => (
                      <ListItem key={instr}>{instr}</ListItem>
                    ))
                  }
                  </List>
                </>
              }
            />
          </Flex>
        </FlexWrap>
      </Wrapper>
    </>
  );
};

export default page;
