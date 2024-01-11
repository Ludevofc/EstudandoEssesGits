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

import java.util.ArrayList;
import java.util.List;

import com.alphabirdz.controller.PostRestController;
import com.alphabirdz.model.Bird;
import com.alphabirdz.model.Post;
import com.alphabirdz.model.User;
import com.alphabirdz.repository.PostRepository;

@SpringBootTest(classes = com.alphabirdz.AlphabirdzApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class PostRestControllerTest {

    @Autowired
    private PostRestController postRestController;

    @MockBean
    private PostRepository postRepository;

    private Post post;
    private List<Post> posts = new ArrayList<Post>();
    private List<Post> emptyPosts = new ArrayList<Post>();
    private MockMvc mockMvc;

    @Before
    public void initOwners() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(postRestController)
                    .build();
        
        post = new Post("url image", "Condado", "2890", new User("profilePhoto", "alphabirdz", "alphabirdz@gmail.com", "123456"),
        new Bird("englishName", "latinName", "portugueseName", "yellow", "campo seco", "family", "80cm")); //Dont have img nor gender
        posts.add(post);

    }
    @Test
    public void testGetPostIdSuccess() throws Exception {
        given(this.postRepository.findById(0)).willReturn(post);
        this.mockMvc.perform(get("/posts/id/0")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.location").value("Condado"));
    }

    @Test
    public void testGetPostIdNotFound() throws Exception {
        given(this.postRepository.findById(999)).willReturn(null);
        this.mockMvc.perform(get("/posts/id/999")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllPostNotFound() throws Exception {
        given(this.postRepository.findAll()).willReturn(emptyPosts);
        this.mockMvc.perform(get("/posts/all")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }


    @Test
    public void testGetAllPostSuccess() throws Exception {
        given(this.postRepository.findAll()).willReturn(posts);
        this.mockMvc.perform(get("/posts/all")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string("[{\"id\":0,\"image\":\"url image\",\"location\":\"Condado\",\"date\":\"2890\",\"user\":1,\"bird\":1}]"));
    }
}