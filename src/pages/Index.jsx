import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Image, Select, Input, Textarea, Checkbox, Flex, Spacer, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const API_BASE_URL = "https://api.affinitygateway.com";

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [newDesign, setNewDesign] = useState({
    title: "",
    product_category_id: "",
    image: null,
    image_filename: "",
    description: "",
    primary_client_id: "",
    is_expedited: false,
  });

  const toast = useToast();

  useEffect(() => {
    fetchCategories();
    fetchOrganizations();
    fetchDesigns();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/product_categories`);
    const data = await res.json();
    setCategories(data.data);
  };

  const fetchOrganizations = async () => {
    const res = await fetch(`${API_BASE_URL}/clients`);
    const data = await res.json();
    setOrganizations(data.data);
  };

  const fetchDesigns = async () => {
    const res = await fetch(`${API_BASE_URL}/designs`);
    const data = await res.json();
    setDesigns(data.data);
  };

  const handleNewDesignChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setNewDesign({ ...newDesign, [name]: val });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewDesign({
        ...newDesign,
        image: reader.result.split(",")[1],
        image_filename: file.name,
      });
    };
  };

  const createDesign = async () => {
    const res = await fetch(`${API_BASE_URL}/designs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDesign),
    });

    if (res.ok) {
      toast({
        title: "Design created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchDesigns();
      setNewDesign({
        title: "",
        product_category_id: "",
        image: null,
        image_filename: "",
        description: "",
        primary_client_id: "",
        is_expedited: false,
      });
    } else {
      toast({
        title: "Error creating design",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const viewDesign = async (id) => {
    const res = await fetch(`${API_BASE_URL}/designs/${id}`);
    const data = await res.json();
    setSelectedDesign(data);
  };

  const deleteDesign = async (id) => {
    const res = await fetch(`${API_BASE_URL}/designs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast({
        title: "Design deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchDesigns();
      setSelectedDesign(null);
    }
  };

  const resubmitDesign = async (designId, image, filename) => {
    const res = await fetch(`${API_BASE_URL}/designs/${designId}/iterations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        image_filename: filename,
      }),
    });

    if (res.ok) {
      toast({
        title: "Design resubmitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      viewDesign(designId);
    }
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        Affinity Consultants Design Portal
      </Heading>

      <Flex mb={8}>
        <Box flex={1} mr={8}>
          <Heading as="h2" size="lg" mb={4}>
            Create New Design
          </Heading>
          <Input name="title" placeholder="Title" value={newDesign.title} onChange={handleNewDesignChange} mb={4} />
          <Select name="product_category_id" placeholder="Select Product Category" value={newDesign.product_category_id} onChange={handleNewDesignChange} mb={4}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          <Input type="file" accept="image/*" onChange={handleImageUpload} mb={4} />
          <Textarea name="description" placeholder="Description" value={newDesign.description} onChange={handleNewDesignChange} mb={4} />
          <Select name="primary_client_id" placeholder="Select Primary Client" value={newDesign.primary_client_id} onChange={handleNewDesignChange} mb={4}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
          <Checkbox name="is_expedited" isChecked={newDesign.is_expedited} onChange={handleNewDesignChange}>
            Expedite Design
          </Checkbox>
          <Button leftIcon={<FaPlus />} colorScheme="blue" mt={4} onClick={createDesign}>
            Create Design
          </Button>
        </Box>
        <Box flex={1}>
          <Heading as="h2" size="lg" mb={4}>
            Designs
          </Heading>
          {designs.map((design) => (
            <Box key={design.id} p={4} borderWidth={1} rounded="md" mb={4} cursor="pointer" onClick={() => viewDesign(design.id)}>
              <Text fontWeight="bold">{design.title}</Text>
              <Text fontSize="sm" color="gray.600">
                {design.product_category.name}
              </Text>
            </Box>
          ))}
        </Box>
      </Flex>

      {selectedDesign && (
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Design Details
          </Heading>
          <Text fontWeight="bold" mb={2}>
            {selectedDesign.title}
          </Text>
          <Text mb={4}>{selectedDesign.description}</Text>
          <Image src={selectedDesign.iterations[0].image.urls.md} alt={selectedDesign.title} mb={4} />
          <Text fontWeight="bold" mb={2}>
            Product Category
          </Text>
          <Text mb={4}>{selectedDesign.product_category.name}</Text>
          <Text fontWeight="bold" mb={2}>
            Primary Client
          </Text>
          <Text mb={4}>{selectedDesign.primary_client.name}</Text>
          <Text fontWeight="bold" mb={2}>
            Status
          </Text>
          <Text mb={4}>{selectedDesign.phase.name}</Text>
          <Flex mb={4}>
            <Button colorScheme="red" leftIcon={<FaTrash />} onClick={() => deleteDesign(selectedDesign.id)}>
              Delete Design
            </Button>
            <Spacer />
            <Button onClick={() => resubmitDesign(selectedDesign.id, selectedDesign.iterations[0].image.urls.or, selectedDesign.iterations[0].image.previous_file_name)}>Resubmit Design</Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Index;
