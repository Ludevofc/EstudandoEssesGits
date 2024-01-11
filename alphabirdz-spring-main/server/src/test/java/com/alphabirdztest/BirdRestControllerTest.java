package com.alphabirdztest;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.alphabirdz.controller.BirdRestController;
import com.alphabirdz.model.Bird;
import com.alphabirdz.repository.BirdRepository;

@SpringBootTest(classes = com.alphabirdz.AlphabirdzApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class BirdRestControllerTest {

    @Autowired
    private BirdRestController birdRestController;

    @MockBean
    private BirdRepository birdRepository;

    private MockMvc mockMvc;

    private Bird bird;

    @Before
    public void initBirds(){
        this.mockMvc = MockMvcBuilders.standaloneSetup(birdRestController).build();
        bird = new Bird("Maguari Stork", "Ciconia maguari", "João-grande", "White", "Campo alagado", "Ciconiidae", "85 cm");
    }

    @Test
    public void testGetBirdSuccess() throws Exception{
        given(this.birdRepository.findById(1)).willReturn(bird);
        this.mockMvc.perform(get("/birds/id/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.englishName").value("Maguari Stork"))
                .andExpect(jsonPath("$.portugueseName").value("João-grande"));
    }

    @Test
    public void testGetBirdNotFound() throws Exception{
        given(this.birdRepository.findById(1)).willReturn(null);
        this.mockMvc.perform(get("/bird/id/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
